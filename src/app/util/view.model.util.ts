import { GameData } from '../models/game.data';
import { Strike3Game, Strike3Pick, Strike3Player } from '../models/strike3.game';
import { Player } from '../models/player';
import { PickStatus, Pick } from '../models/pick';
import { User } from '../models/user';

export function BuildViewModel(admin: boolean, gameData: GameData, currentUser: User): Strike3Game {
    const strike3Game: Strike3Game = {players: [], week: null, tieBreakers: null};

    if (!gameData) return strike3Game;

    strike3Game.week = gameData.week;
    strike3Game.tieBreakers = gameData.tieBreakers;

    gameData.players.forEach((player) => {
        const strike3Player: Strike3Player = {
            name: player.name,
            email: player.email,
            picks: GetStrike3PicksForPlayer(player, admin, gameData, currentUser),
            strikes: 0,
            admin: player.admin,
            uid: player.uid,
            rank: 0
        };

        strike3Player.strikes = GetNumStrikesForPlayer(strike3Player);

        if (!admin) {
            strike3Player.signedIn = currentUser && player.uid === currentUser.uid;
        }

        strike3Game.players.push(strike3Player);
    });

    strike3Game.players.forEach((player: Strike3Player) => {
        player.rank = GetRankForPlayer(player, strike3Game);
    });

    SortStrike3Players(strike3Game.players);

    return strike3Game;
}

function GetStrike3PicksForPlayer(player: Player, admin: boolean, gameData: GameData, currentUser: User): Strike3Pick[] {
    const firstEditableWeek = gameData.week.weekNumber;

    const strike3Picks: Strike3Pick[] = [];
    const picks: Pick[] = GetPicksForPlayer(player, admin, gameData, currentUser);

    for (const pick of picks) {
        let canEdit = currentUser && currentUser.uid === player.uid;
        canEdit = canEdit && pick.week >= firstEditableWeek;
        canEdit = canEdit && !pick.team;
        canEdit = canEdit || admin;

        const strike3Pick: Strike3Pick = {
            week: pick.week,
            team: pick.team,
            canEdit: canEdit,
            playerName: player.name,
            uid: player.uid,
            status: pick.status,
            tieBreakerTeam: pick.tieBreakerTeam,
            tieBreakerPoints: pick.tieBreakerPoints
        };

        strike3Picks.push(strike3Pick);
    }

    return strike3Picks;
}

function GetPicksForPlayer(player: Player, admin: boolean, gameData: GameData, currentUser: User): Pick[] {
    const lastViewableWeek = gameData.week.public ? gameData.week.weekNumber : gameData.week.weekNumber - 1;

    let playerPicks: Pick[] = [];

    if (player.picks) {
        player.picks.forEach((currentPick) => {
            playerPicks.push(currentPick);
        });
    }

    const canViewAllPicks = admin || (currentUser && currentUser.uid === player.uid) || player.admin;

    if (!canViewAllPicks) {
        playerPicks = playerPicks.filter((currentPick) => {
            return (currentPick.week <= lastViewableWeek) || HasGameStarted(currentPick.week, currentPick.team, gameData);
        });
    }

    AddEmptyPicks(playerPicks);
    SortPicks(playerPicks);

    return playerPicks;
}

function HasGameStarted(week: number, team: string, gameData: GameData): boolean {
    if (team === 'NP') return true;

    const nflGame = gameData.schedule.get(week).find((currentNflGame) => {
        return currentNflGame.awayTeam === team || currentNflGame.homeTeam === team;
    });

    if (nflGame) {
        const currentTime = new Date().getTime();
        return currentTime > nflGame.time;
    }

    return false;
}

function AddEmptyPicks(picks: Pick[]) {
    for (let week = 1; week <= 17; week++) {
        const foundPick = picks.find((currentPick) => {
            return currentPick.week === week;
        });

        if (!foundPick) {
            picks.push({
                week: week,
                status: PickStatus.Open
            });
        }
    }
}

function SortPicks(picks: Pick[]) {
    picks.sort((a, b): number => {
        if (a.week < b.week) return -1;
        if (a.week > b.week) return 1;
        return 0;
    });
}

function GetNumStrikesForPlayer(strike3Player: Strike3Player): number {
    let numStrikes = 0;

    for (const strike3Pick of strike3Player.picks) {
        if (numStrikes >= 3) {
            strike3Pick.eliminated = true;
            strike3Pick.canEdit = false;
        }
        if (strike3Pick.status === PickStatus.Loss) {
            numStrikes = numStrikes + 1;
        } else if (strike3Pick.status === PickStatus.Tie) {
            numStrikes = numStrikes + 0.5;
        }
    }

    return numStrikes;
}

function GetEliminationWeek(strike3Player: Strike3Player): number {
    let eliminationWeek: number = 100;
    let strikes: number = 0;

    for (const strike3Pick of strike3Player.picks) {
        if (strike3Pick.status === PickStatus.Loss) {
            strikes = strikes + 1;
        } else if (strike3Pick.status === PickStatus.Tie) {
            strikes = strikes + 0.5;
        }

        if (strikes >= 3) {
            eliminationWeek = strike3Pick.week;
            break;
        }
    }

    return eliminationWeek;
}

function GetRankForPlayer(playerToRank: Strike3Player, strike3Game: Strike3Game): number {
    const playersAhead: Strike3Player[] = [];

    strike3Game.players.forEach((player: Strike3Player) => {
        if (player.uid !== playerToRank.uid) {

            // skip everything if player to rank has less strikes
            if (playerToRank.strikes < player.strikes) return;

            // if player has less strikes
            if (player.strikes < playerToRank.strikes) {
                playersAhead.push(player);
                return;
            }

            const playerToRankEliminationWeek = GetEliminationWeek(playerToRank);
            const playerEliminationWeek = GetEliminationWeek(player);

            // if player was eliminated later
            if (playerToRankEliminationWeek < playerEliminationWeek) {
                playersAhead.push(player);
                return;
            }

            // if players eliminated same week, go to tie breaker
            if ((playerToRankEliminationWeek === playerEliminationWeek) && playerEliminationWeek <= 17) {
                if (DidOtherPlayerWinTieBreaker(playerToRank, player, strike3Game, playerEliminationWeek)) {
                    playersAhead.push(player);
                }
            }

            // if both players not yet eliminated
            if ((playerToRankEliminationWeek === playerEliminationWeek) && playerEliminationWeek > 17) {
                // use final tie breaker
                if (DidOtherPlayerWinTieBreaker(playerToRank, player, strike3Game, 17)) {
                    playersAhead.push(player);
                }
            }
        }
    });

    return playersAhead.length + 1;
}

function DidOtherPlayerWinTieBreaker(playerToRank: Strike3Player, otherPlayer: Strike3Player, strike3Game: Strike3Game, week: number): boolean {
    const tieBreaker = strike3Game.tieBreakers.get(week);

    const playerToRankPick = playerToRank.picks.find((pick) => {
        return pick.week === week;
    });

    const otherPlayerPick = otherPlayer.picks.find((pick) => {
        return pick.week === week;
    });

    // if no tie breaker set
    if (!tieBreaker) return false;

    // if player to rank did not submit a tie breaker
    if (!playerToRankPick.tieBreakerTeam && otherPlayerPick.tieBreakerTeam) return true;

    if (tieBreaker && tieBreaker.winningTeam && playerToRankPick.tieBreakerTeam && otherPlayerPick.tieBreakerTeam) {
        if ((playerToRankPick.tieBreakerTeam === tieBreaker.winningTeam) && (otherPlayerPick.tieBreakerTeam !== tieBreaker.winningTeam)) return false;
        if ((playerToRankPick.tieBreakerTeam !== tieBreaker.winningTeam) && (otherPlayerPick.tieBreakerTeam === tieBreaker.winningTeam)) return true;

        let otherPlayerWon: boolean = (playerToRankPick.tieBreakerPoints > tieBreaker.points) && (otherPlayerPick.tieBreakerPoints <= tieBreaker.points);

        otherPlayerWon = otherPlayerWon || ((playerToRankPick.tieBreakerPoints > tieBreaker.points) && (otherPlayerPick.tieBreakerPoints > tieBreaker.points))
            && (playerToRankPick.tieBreakerPoints > otherPlayerPick.tieBreakerPoints);

        otherPlayerWon = otherPlayerWon || ((playerToRankPick.tieBreakerPoints <= tieBreaker.points) && (otherPlayerPick.tieBreakerPoints <= tieBreaker.points))
            && (playerToRankPick.tieBreakerPoints < otherPlayerPick.tieBreakerPoints);

        return otherPlayerWon;
    }

    return false;
}

function SortStrike3Players(strike3Players: Strike3Player[]) {
    strike3Players.sort((a, b): number => {
        if (a.rank < b.rank) return -1;
        if (a.rank > b.rank) return 1;
        if (!!a.name && !!b.name) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        }
        return 0;
    });
}

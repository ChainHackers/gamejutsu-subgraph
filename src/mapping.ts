import {
    GameFinished,
    GamesStarted,
    PlayerDisqualified
} from "../generated/Arbiter/Arbiter"
import {GameFinishedEntity, InRowCounterEntity} from "../generated/schema"

function incCounter(inRowCounter: InRowCounterEntity, counter: string): InRowCounterEntity {
    if (counter == 'cheater') {
        inRowCounter.loserCount += 1
        inRowCounter.loserMaxValue = max(inRowCounter.loserMaxValue, inRowCounter.loserCount)
        inRowCounter.cheaterCount += 1
        inRowCounter.cheaterMaxValue = max(inRowCounter.cheaterMaxValue, inRowCounter.cheaterCount)
        inRowCounter.winnerCount = 0
        inRowCounter.drawCount = 0
    }
    if (counter == 'winner') {
        inRowCounter.winnerCount += 1
        inRowCounter.winnerMaxValue = max(inRowCounter.winnerMaxValue, inRowCounter.winnerCount)
        inRowCounter.loserCount = 0
        inRowCounter.drawCount = 0
        inRowCounter.cheaterCount = 0
    }
    if (counter == 'loser') {
        inRowCounter.loserCount += 1
        inRowCounter.loserMaxValue = max(inRowCounter.loserMaxValue, inRowCounter.loserCount)
        inRowCounter.winnerCount = 0
        inRowCounter.drawCount = 0
        inRowCounter.cheaterCount = 0
    }
    if (counter == 'draw') {
        inRowCounter.drawCount += 1
        inRowCounter.drawMaxValue = max(inRowCounter.drawMaxValue, inRowCounter.drawCount)
        inRowCounter.winnerCount = 0
        inRowCounter.loserCount = 0
        inRowCounter.cheaterCount = 0
    }
    return inRowCounter;
}

function loadInRowCounterEntity(id: string): InRowCounterEntity {
    let entity = InRowCounterEntity.load(id)
    if (!entity) {
        entity = new InRowCounterEntity(id)
    }
    return entity;
}


export function handleGameFinished(event: GameFinished): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = GameFinishedEntity.load(event.transaction.hash.toHex())
    if (!entity) {
        entity = new GameFinishedEntity(event.transaction.hash.toHex())
    }
    // Entity fields can be set based on event parameters
    entity.gameId = event.params.gameId
    entity.winner = event.params.winner
    entity.loser = event.params.loser
    entity.isDraw = event.params.isDraw

    entity.save()

    let winnerInRowCounter = loadInRowCounterEntity(event.params.winner.toHex())
    let loserInRowCounter = loadInRowCounterEntity(event.params.loser.toHex())

    if (entity.isDraw) {
        incCounter(winnerInRowCounter, 'draw');
        incCounter(loserInRowCounter, 'draw');
    } else {
        incCounter(winnerInRowCounter, 'winner');
        incCounter(loserInRowCounter, 'loser');
    }

    winnerInRowCounter.save()
    loserInRowCounter.save()
}

export function handleGamesStarted(event: GamesStarted): void {
}

export function handlePlayerDisqualified(event: PlayerDisqualified): void {
    //expected the same transaction id for GameFinished event
    let entity = GameFinishedEntity.load(event.transaction.hash.toHex())!

    // Entity fields can be set based on event parameters
    entity.gameId = event.params.gameId
    entity.cheater = event.params.player

    entity.save()

    let cheaterInRowCounter = loadInRowCounterEntity(entity.cheater.toHex())

    incCounter(cheaterInRowCounter, 'cheater');

    cheaterInRowCounter.save()
}

import {
    GameFinished,
    GameStarted,
    GameProposed,
    PlayerResigned,
    SessionAddressRegistered,
    PlayerDisqualified
} from "../generated/Arbiter/Arbiter"
import {GameEntity, InRowCounterEntity} from "../generated/schema"

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
        entity.winnerCount = 0;
        entity.loserCount = 0;
        entity.drawCount = 0;
        entity.cheaterCount = 0;
        entity.winnerMaxValue = 0;
        entity.loserMaxValue = 0;
        entity.drawMaxValue = 0;
        entity.cheaterMaxValue = 0;
    }
    return entity;
}


export function handleGameFinished(event: GameFinished): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = GameEntity.load(event.params.gameId.toHex())
    if (!entity) {
        entity = new GameEntity(event.params.gameId.toHex())
    }
    // Entity fields can be set based on event parameters
    entity.gameId = event.params.gameId
    entity.winner = event.params.winner
    entity.loser = event.params.loser
    entity.isDraw = event.params.isDraw
    entity.finished = true;

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

export function handlePlayerDisqualified(event: PlayerDisqualified): void {
    
    let entity = GameEntity.load(event.params.gameId.toHex())!

    // Entity fields can be set based on event parameters
    entity.gameId = event.params.gameId
    entity.cheater = event.params.player

    entity.save()

    let cheaterInRowCounter = loadInRowCounterEntity(event.params.player.toHex())

    incCounter(cheaterInRowCounter, 'cheater');

    cheaterInRowCounter.save()
}


export function handleGameProposed(event: GameProposed): void {
    let entity = GameEntity.load(event.params.gameId.toHex())
    if (!entity) {
        entity = new GameEntity(event.params.gameId.toHex())
    }
    entity.gameId = event.params.gameId;
    entity.proposer = event.transaction.from;
    entity.stake = event.params.stake;
    entity.save()
}

export function handleGameStarted(event: GameStarted): void {
    let entity = GameEntity.load(event.params.gameId.toHex())
    if (!entity) {
        entity = new GameEntity(event.params.gameId.toHex())
    }
    entity.gameId = event.params.gameId;
    entity.started = true
    entity.save()
}


export function handlePlayerResigned(event: PlayerResigned): void {
    let entity = GameEntity.load(event.params.gameId.toHex())
    if (!entity) {
        entity = new GameEntity(event.params.gameId.toHex())
    }
    entity.gameId = event.params.gameId;
    entity.resigned = true
    entity.save()
}


export function handleSessionAddressRegistered(event: SessionAddressRegistered): void {
    
}

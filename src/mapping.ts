import { BigInt } from "@graphprotocol/graph-ts"
import {
  Arbiter,
  GameFinished,
  GamesStarted,
  PlayerDisqualified
} from "../generated/Arbiter/Arbiter"
import { GameFinishedEntity } from "../generated/schema"

export function handleGameFinished(event: GameFinished): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = GameFinishedEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new GameFinishedEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.gameId = event.params.gameId
  entity.winner = event.params.winner
  entity.loser = event.params.loser
  entity.isDraw = event.params.isDraw

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DEFAULT_TIMEOUT(...)
  // - contract.DEFAULT_TIMEOUT_STAKE(...)
  // - contract.DOMAIN_SEPARATOR(...)
  // - contract.DOMAIN_TYPEHASH(...)
  // - contract.GAME_MOVE_TYPEHASH(...)
  // - contract.NUM_PLAYERS(...)
  // - contract.games(...)
  // - contract.getPlayerFromSignedGameMove(...)
  // - contract.getPlayers(...)
  // - contract.isPlayer(...)
  // - contract.isValidGameMove(...)
  // - contract.nextGameId(...)
  // - contract.recoverAddress(...)
  // - contract.timeouts(...)
}

export function handleGamesStarted(event: GamesStarted): void {}

export function handlePlayerDisqualified(event: PlayerDisqualified): void {
  //expected the same transaction id for GameFinished event
  let entity = GameFinishedEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new GameFinishedEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.gameId = event.params.gameId
  entity.cheater = event.params.player

  // Entities can be written to the store with `.save()`
  entity.save()
}

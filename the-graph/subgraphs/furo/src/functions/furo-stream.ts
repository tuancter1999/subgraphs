import { BigInt } from '@graphprotocol/graph-ts';
import { Stream } from '../../generated/schema';
import {
  LogCreateStream as CreateStreamEvent
} from '../../generated/FuroStream/FuroStream';
import { getOrCreateUser } from './user';
import { getOrCreateToken } from './token';
import { ONGOING } from '../constants';
import { log } from 'matchstick-as';


function getOrCreateStream(id: BigInt): Stream {
  let stream = Stream.load(id.toString())

  if (stream === null) {
    stream = new Stream(id.toString())
  }
  stream.save()

  return stream as Stream
}

export function createStream(event: CreateStreamEvent): Stream {
  let stream = getOrCreateStream(event.params.streamId)
  let recipient = getOrCreateUser(event.params.recipient)
  let sender = getOrCreateUser(event.params.sender)
  let token = getOrCreateToken(event.params.token.toHex())
  
  stream.recipient = recipient.id
  stream.amount = event.params.amount
  stream.withdrawnAmount = BigInt.fromU32(0)
  stream.token = token.id
  stream.status = ONGOING
  stream.createdBy = sender.id
  stream.fromBentoBox = event.params.fromBentoBox
  stream.startedAt = event.params.startTime
  stream.exiresAt = event.params.endTime
  stream.modifiedAtBlock = event.block.number
  stream.modifiedAtTimestamp = event.block.timestamp
  stream.save()
  return stream
}
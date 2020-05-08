import React, { useEffect, useRef, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { RoomClient, RoomClientOptions } from './RoomClient';
import shortid from 'shortid';
import { RoomClientContextProvider } from './RoomContext';

interface RTCContainerProps extends Omit<RoomClientOptions, 'peerId'> {}
export const RTCContainer: React.FC<RTCContainerProps> = TMemo((props) => {
  const {
    roomId,
    displayName,
    device,
    forceTcp = false,
    produce = true,
    consume = true,
    forceH264 = false,
    forceVP9 = false,
    datachannel = true,
    externalVideo = false,
  } = props;
  const [roomClient, setRoomClient] = useState<RoomClient>(null);
  useEffect(() => {
    const peerId = shortid.generate();
    const client = new RoomClient({
      roomId,
      peerId,
      displayName,
      device,
      forceTcp,
      produce,
      consume,
      forceH264,
      forceVP9,
      datachannel,
      externalVideo,
    });
    setRoomClient(client);
  }, []);

  return (
    <RoomClientContextProvider roomClient={roomClient}>
      {props.children}
    </RoomClientContextProvider>
  );
});
RTCContainer.displayName = 'RTCContainer';

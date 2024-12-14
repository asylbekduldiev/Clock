import PubNub from 'pubnub';

const pubnub = new PubNub({
  publishKey: 'pub-c-92fd48e2-cd10-41d4-97bf-c614bf5b1fdc',
  subscribeKey: 'sub-c-69fb861e-da57-4c97-a158-17136fec2323',
  uuid: 'sec-c-MmNlYjgyZWQtYmMxMy00ODJiLTljZmEtMTMzZjdjYWQxZmFi'
});

export const publishMessage = (channel, message) => {
  pubnub.publish({
    channel,
    message,
  });
};

export const subscribeToChannel = (channel, callback) => {
  pubnub.addListener({
    message: (msg) => {
      if (msg.channel === channel) {
        callback(msg.message);
      }
    },
  });
  pubnub.subscribe({ channels: [channel] });
};

export const unsubscribeFromChannel = (channel) => {
  pubnub.unsubscribe({ channels: [channel] });
};
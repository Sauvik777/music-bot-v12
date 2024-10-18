module.exports = (client, error, message) => {
    console.error(`Music error: ${error}`);

    if (message) {
        switch (error) {
            case 'NotPlaying':
                message.channel.send(`${client.emotes.error} - There is no music being played on this server!`);
                break;
            case 'NotConnected':
                message.channel.send(`${client.emotes.error} - You are not connected to any voice channel!`);
                break;
            case 'UnableToJoin':
                message.channel.send(`${client.emotes.error} - I am unable to join your voice channel. Please check my permissions!`);
                break;
            default:
                message.channel.send(`${client.emotes.error} - Something went wrong... Error: ${error}`);
        }
    } else {
        console.error(`Error occurred but no message context available: ${error}`);
    }
};


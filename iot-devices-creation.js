const { IoTClient, CreateThingCommand } = require("@aws-sdk/client-iot");
const { fromIni } = require("@aws-sdk/credential-provider-ini");

const createThings = async (deviceName, serialNumber) => {
  const iotClient = new IoTClient({
    credentials: fromIni({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }),
    region: process.env.AWS_REGION,
  });
  try {
    const command = new CreateThingCommand({ thingName: deviceName });
    const result = await iotClient.send(command);
    console.log(
      `Created device: ${result.thingName} - Serial no. ${serialNumber} - (${result.thingArn})`
    );

    const shadowCommand = new UpdateThingShadowCommand({
      thingName: deviceName,
      payload: JSON.stringify({ state: { desired: {} } }),
    });
    await iotClient.send(shadowCommand);
    console.log(`Created Thing Shadow for ${deviceName}`);
  } catch (error) {
    console.error("Error creating device:", error);
  }
};

module.exports = { createThings };

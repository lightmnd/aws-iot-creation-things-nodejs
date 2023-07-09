const pem = require("pem");
const fs = require("fs");

const generateCertificates = () => {
  return new Promise((resolve, reject) => {
    pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
      if (err) {
        reject(err);
      } else {
        resolve(keys);
      }
    });
  });
};

const generatePaths = async () => {
  try {
    const { serviceKey, certificate, ca } = await generateCertificates();
    const keyPath = "./certs/private-key.pem";
    const certPath = "./certs/certificate.pem";
    const caPath = "./certs/root-ca.pem";

    // Save the private key, certificate, and CA to files
    fs.writeFileSync(keyPath, serviceKey);
    fs.writeFileSync(certPath, certificate);
    fs.writeFileSync(caPath, ca);

    console.log("Certificates generated successfully");
  } catch (error) {
    console.error("Error generating certificates:", error);
  }
};

generatePaths();

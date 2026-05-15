const fs = require("fs");
const crypto = require("crypto");

try {
  const certPath = "ProductionCertificate.pem";
  if (!fs.existsSync(certPath)) {
    console.error(`Error: ${certPath} not found.`);
    process.exit(1);
  }

  const certData = fs.readFileSync(certPath, "utf8").trim();
  
  let publicKey;
  try {
    // Try modern X509Certificate API (Node 15.6+)
    const x509 = new crypto.X509Certificate(certData);
    publicKey = x509.publicKey;
    console.log("Extracted public key from X.509 certificate.");
  } catch (e) {
    console.warn("X509Certificate failed, trying createPublicKey...");
    publicKey = crypto.createPublicKey(certData);
  }

  const initiatorPassword = "KirikaJoseph#2026";

  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(initiatorPassword)
  );

  const securityCredential = encrypted.toString("base64");
  
  console.log("\n==========================================");
  console.log("M-PESA SECURITY CREDENTIAL (ENCRYPTED)");
  console.log("==========================================\n");
  console.log(securityCredential);
  console.log("\n==========================================\n");

} catch (error) {
  console.error("\n!!! ENCRYPTION ERROR !!!");
  console.error(error.message);
  if (error.stack) console.error(error.stack);
  process.exit(1);
}
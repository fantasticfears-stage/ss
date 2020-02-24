import React from 'react';
import './App.css';
import CryptoJS from 'crypto-js';

function Decrypt(cipherData, key, iv) {
  key = CryptoJS.enc.Hex.parse(key);
  iv = CryptoJS.enc.Hex.parse(iv);

  var data = CryptoJS.AES.decrypt(cipherData, key, { iv }); 
  return data.toString(CryptoJS.enc.Utf8);
}

function DecryptValue(word, value) {
  if (value.indexOf(':') === -1) {
    return;
  }
  const [key, iv] = value.split(':');
  const decrypted = Decrypt(word, CryptoJS.enc.Base64.parse(key).toString(), iv);
  return decrypted;
}

// eslint-disable-next-line
function Encrypt(message, key) { // key length decides AES-128 (4 bytes), AES-256 (8 bytes)
  key = CryptoJS.enc.Base64.parse(key);
  const iv = CryptoJS.lib.WordArray.random(16); // length = 4 bytes. Because cipher block is 128 bits.

  const cipherData = CryptoJS.AES.encrypt(message, key, { iv });
  return [cipherData.key.toString(), cipherData.iv.toString(), cipherData.toString()];
}

const MESSAGE = "HKujAVONdiDgn99ak+HPW+KOqNV31Zx8GMEtO9onDzx/obj+1vrDPIlvCIPVif1Ssi82/tvOS34lZ1ajJQZgsp/+H5fX0bdyI2aG1j0ybVg/Xar+bWCkvB6sS5UU5rQfA6Hj1gmHAIRB23Qa16Yt/NpLxsBI11MvMIDkGb7jYzX3tS/tb6TS8RrJj7u/IjTok1RHXdE8RjUUgtuJ4DoYzdty/Q+eb5EpMZHy4uFk5KSgePyN2A20hksmSFUV72T3iafH6zTpM5Z232yy7vWZ65vC6T4VM2pot2bWpx41NWCPRJKe7zBWZJ5IoRqe+a6Au5Oygzvr+unpSJzHXxBv3PE1w8if4/mvHRGkogFkshs03BniWMuWTrIMGrUnKlYlDt4ez/O1CmWknBFD2FZ/VDSw+6CAwdyeaLJ8b+MA0pQyyxvAFU+oB/c+bhzGYeFm5dVJldIn7xzPiCtRApy8OWKEW4gNF/+AIgfQHT4IW0PFXw8xejVUGNbZrUmgnq3voohzbHpeCYSdAUvDRpDizw==";

/// usage:
// 1. manually invoke Encrypt and log message.
// 2. copy the data to MESSAGE and record key and iv;
// 3. key should be longer enough to become 8 bytes in encryption
// 4. distribute key:iv for decryption
function App() {
  const [value, setValue] = React.useState("");
  const [show, setShow] = React.useState(false);

  // const key = "";
  // const RAW_MESSAGE = ``
  // const enc = Encrypt(RAW_MESSAGE, key);
  // const secret = `${key}:${enc[1]}`;
  // console.log(enc[2], secret, DecryptValue(enc[2], secret));

  return (
    <div className="App">
      <p>粘贴秘钥解密服务器信息。输错可能致网页崩溃，刷新重试。</p>
      <p>如果确认秘钥正确而且你记得的秘钥早于更新时间但是无法显示，可能信息已经更新过了。去问下有没有新的秘钥。</p>
      <p>上次更新日期：2020-02-24</p>
      <input style={{width: '500px'}} value={value} onChange={(e) => setValue(e.currentTarget.value)}/>
      <button onClick={() => setShow(true)}>解密</button>
      {show && <pre>
        {DecryptValue(MESSAGE, value)}
      </pre>}
    </div>
  );
}

export default App;

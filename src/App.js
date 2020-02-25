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

const MESSAGE = "96T8TJWga82IPHR414H+XFrlSPBEL8D0hTFP+pv2w/U8NsLoyfTvhNp+EAwsKUMC2MVQ2NLE7pd3nPpCDB0mDn/TN3Vonn+yyrUhp0CgRmN08j7luW7KDviR6Q3x7VOLXY8hdJFjBjzMLVr5BFXbQUi+BA3Bo/fVVXvgtPVDOvlzj2NlcJonWX5/st/qzzFmhs4oHbLBZFaUWv1xwRK/nZI+JB9fUjZWd/a7POYXE2sggr2qqOy53w1pzBbTWBVUYEry7ly9tOzDPnDUBoC4YqlFQS8ABl3wUBJi3xKOPynjK/1WY5YVC7yNWIXm44AIH20JjmhkV9iJpYmGP7FOpHJSIOh0xW2HgXFj08aEXvtN0ztRdubzcInA2tAQxAXvQ8TU0jDrHBFU/Q95duA8xLv9HNctlcUL/qOhaV5yhGFTFhYNbGOQiQGlWJBiZP1HkeXrLj/zxeDlAw2RcNmdZHAqV5MM4jSw8difezbC9HXAhByOPCE+Hz/M5zyeKkNszM0c+cRL00DyrD7lXMP1HVpw9MVSqMZ1p3WPfqsIRD56bJ018kbGo3jEZy6OKjldz0d58QiUI/ajXMOIv9g4UgcV+bwXfy2y2zo71mWKdqcKlDLZBdlh4Y1o1Zim+JFEz58AoILsAZ3OQRAN6RdEHg=="

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
      <p>上次更新日期：2020-02-25</p>
      <input style={{width: '500px'}} value={value} onChange={(e) => setValue(e.currentTarget.value)}/>
      <button onClick={() => setShow(true)}>解密</button>
      {show && <pre>
        {DecryptValue(MESSAGE, value)}
      </pre>}
    </div>
  );
}

export default App;

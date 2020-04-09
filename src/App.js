import React from 'react';
import './App.css';
import CryptoJS from 'crypto-js';
import QRCode from 'qrcode';

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

const MESSAGE = "BxHnuTWihkLcU4itnI+lzLpU2fM/slTIDnoGuIOtD0Y+oDvT+xv9EhqfkihEqVpme2gE9MfQIvMvfT5QC+PQz4KIf+oJuG4hpME3pOnKDbVu8BElUeLYGNxMc/f43lrmPtR8goxjA9FwRFCPYipjgLTsmPpaShUkypKp/e9Gf4H76EFQF0Tx9s2e81TX0wOhJWIvRv4gPYLKGy70/Cdk5c4j+HyUNnL/m2myACkHxjtKzdlkvadgsk4Jq/4H7UOVXmb1Zb6Dabd6fiT1vBSR4gXKW+VnT2otFfL3IXJvnJ3oSWBNseGxHHTcnTgLg6959rUpKzysJGT4mV+Y9zbQOY7JVWfV+mh+h9FQGXFmrnvRU8WmptXmYU7q9C9afGEvjFvy9c17lJ4JFXZwlIQJDA==";

/// usage:
// 1. manually invoke Encrypt and log message.
// 2. copy the data to MESSAGE and record key and iv;
// 3. key should be longer enough to become 8 bytes in encryption
// 4. distribute key:iv for decryption

// const key = "";
// const RAW_MESSAGE = ``;

// const enc = Encrypt(RAW_MESSAGE, key);
// const secret = `${key}:${enc[1]}`;
// console.log(enc[2], secret, DecryptValue(enc[2], secret));

function App() {
  const [value, setValue] = React.useState("");
  const [show, setShow] = React.useState(false);
  const canvas1 = React.useRef();
  const canvas2 = React.useRef();
  React.useEffect(() => {
    if (show) {
      const val = DecryptValue(MESSAGE, value);
      if (val.length > 0 && canvas1.current && canvas2.current) {
        const msgSep = val.split('\n');
  
        QRCode.toCanvas(canvas1.current, msgSep[1], function (error) {
          if (error) console.error(error)
          console.log('success!');
        });
  
        QRCode.toCanvas(canvas2.current, msgSep[2], function (error) {
          if (error) console.error(error)
          console.log('success!');
        });
      }
    }
  }, [show, value]);

  return (
    <div className="App">
      <p>粘贴解密服务器信息。输错可能致网页崩溃，要刷新重来。</p>
      <p>如果确认信息正确而且你记得的信息早于更新时间但是无法显示，可能信息已经更新过了。去问下有没有新的。</p>
      <p>上次更新日期：2020-04-09</p>
      <input style={{width: '500px'}} value={value} onChange={(e) => setValue(e.currentTarget.value)}/>
      <button onClick={() => setShow(true)}>解密</button>
      {show && <div>
        <pre>
        {DecryptValue(MESSAGE, value)}
      </pre> 
      <canvas width="300" height="300" ref={canvas1}></canvas>
      <canvas width="300" height="300" ref={canvas2}></canvas>
        </div>}
    </div>
  );
}

export default App;

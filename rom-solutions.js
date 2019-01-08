window.romSolutions = (function() {

  const INES_HEADER = [ 0x4e, 0x45, 0x53, 0x1a ];

  function readNESRom(fileBlob) {

  }

  function _extractINESInfo(data) {
    // Validate the iNES Header
    const headerValid = INES_HEADER.reduce((isValid, byte, index) => {
      isValid = isValid && data[index] === byte;
    }, true);

    return headerValid;
  }

  async function getROMInfo(fileBlob) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(fileBlob);
      fileReader.addEventListener('error', reject);
      fileReader.addEventListener('loadend', evt => {
        const data = evt.target.result;
        const iNESInfo = _extractINESInfo(data);
        if (iNESInfo === false) {
          reject('Invalid NES ROM');
        }
        resolve(true);
      });
    });
  }

  // My god, the revealing module pattern because I'm too lazy to webpack :O
  return {
    readNESRom,
    getROMInfo
  };

}());
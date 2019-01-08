window.romSolutions = (function() {

  const INES_HEADER = [ 0x4e, 0x45, 0x53, 0x1a ];
  const PRG_BANK_SIZE = 16384;
  const CHR_BANK_SIZE = 8192;

  function readNESRom(fileBlob) {

  }

  function _extractINESInfo(data) {
    // Validate the iNES Header and ensure there's no trainer
    let headerValid = INES_HEADER.reduce((isValid, byte, index) => {
      return isValid && data[index] === byte;
    }, true);
    headerValid = headerValid && ((data[6] & 0x4) === 0);

    const retVal = {};
    if (headerValid) {
      retVal.prgSize = data[4] * PRG_BANK_SIZE;
      retVal.chrSize = data[5] * CHR_BANK_SIZE;
      retVal.mapperId = ((data[6] & 0xf0) >> 0x4) | (data[7] & 0xf0);
    }

    return headerValid && retVal;
  }

  async function getROMInfo(fileBlob) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(fileBlob);
      fileReader.addEventListener('error', reject);
      fileReader.addEventListener('loadend', evt => {
        const data = new Uint8Array(evt.target.result);
        const iNESInfo = _extractINESInfo(data);
        if (iNESInfo === false) {
          reject('Invalid NES ROM');
        }
        resolve(iNESInfo);
      });
    });
  }

  // My god, the revealing module pattern because I'm too lazy to webpack :O
  return {
    readNESRom,
    getROMInfo
  };

}());
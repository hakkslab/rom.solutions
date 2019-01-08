window.romSolutions = (function() {

  const INES_HEADER = [ 0x4e, 0x45, 0x53, 0x1a ];
  const PRG_BANK_SIZE = 16384;
  const CHR_BANK_SIZE = 8192;

  const MAPPER_NAMES = {
    0: 'NROM',
    1: 'MMC1',
    105: 'MMC1',
    155: 'MMC1',
    2: 'UNROM',
    94: 'UN1ROM - Senjou no Ookami',
    180: 'UNROM - Crazy Climber',
    3: 'CNROM',
    4: 'MMC3 / TxROM',
    118: 'MMC3 - TKSROM / TLSROM',
    119: 'MMC3 - TQROM',
    5: 'MMC5 / ExROM',
    7: 'AxROM',
    9: 'MMC2 / PxROM',
    10: 'MMC4 / FxROM',
    37: 'MMC3 - Super Mario Bros + Tetris + Nintendo World Cup',
    155: 'MMC1A',
    185: 'CNROM + Copy Protection',
    66: 'GxROM',
    99: 'CNROM Vs System'
  };

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
      retVal.mapperName = MAPPER_NAMES[retVal.mapperId];
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
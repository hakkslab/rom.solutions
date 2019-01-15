window.RomSolutions = (function() {

  const INES_HEADER = [ 0x4e, 0x45, 0x53, 0x1a ];
  const PRG_BANK_SIZE = 16384;
  const CHR_BANK_SIZE = 8192;
  const HEADER_SIZE = 16;

  /**
   * Most common Nintendo mappers and iNES ID variants
   */
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

  class Rom {

    /**
     * The contents of PRG-ROM
     *
     * @type {Uint8Array}
     */
    get prgRom() {
      return this._prgRom || [];
    }

    /**
     * The size of PRG-ROM in bytes
     *
     * @type {Number}
     */
    get prgRomSize() {
      return this.prgRom.length;
    }

    /**
     * The contents of CHR-ROM
     *
     * @type {Uint8Array}
     */
    get chrRom() {
      return this._chrRom || [];
    }

    /**
     * The size of CHR-ROM in bytes
     *
     * @type {Number}
     */
    get chrRomSize() {
      return this.chrRom.length;
    }

    /**
     * The iNES mapper ID of the ROM
     *
     * @type {Number}
     */
    get mapperId() {
      return this._mapperId;
    }

    /**
     * The name of the mapper or the ID if no name is available
     *
     * @type {String}
     */
    get mapperName() {
      return MAPPER_NAMES[this._mapperId] || this._mapperId;
    }

    constructor() {
      this._data = null;
      this._prgRom = null;
      this._chrRom = null;
      this._mapperId = null;
    }

    /**
     * Creates an specifically sized EPROM binary from a source ROM.
     * Source is mirrored to fill the whole output size.
     *
     * @param {Uint8Array} srcRom The source ROM data
     * @param {Number} destSize Size of the EPROM binary to generate
     * @return {Blob} The generated EPROM
     */
    static createEpromBinary(srcRom, destSize) {
      const eprom = new Uint8Array(destSize);
      for (let i = 0; i < destSize; i += srcRom.length) {
        eprom.set(srcRom, i);
      }
      return new Blob([ eprom.buffer ], { type: 'application/octet-stream' });
    }

    /**
     * Loads an NES rom from the file provided
     *
     * @param {File} fileBlob
     */
    async load(fileBlob) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(fileBlob);
        fileReader.addEventListener('error', reject);
        fileReader.addEventListener('loadend', evt => {
          this._data = new Uint8Array(evt.target.result);
          if (!this._extractINESInfo()) {
            reject('Invalid NES ROM');
          }
          resolve();
        });
      });
    }

    /**
     * Validates and reads the iNES header into object properties
     *
     * @private
     * @return {Boolean} Whether the ROM header is valid
     */
    _extractINESInfo() {
      const data = this._data;

      // Validate the iNES Header and ensure there's no trainer
      let headerValid = INES_HEADER.reduce((isValid, byte, index) => {
        return isValid && data[index] === byte;
      }, true);
      headerValid = headerValid && ((data[6] & 0x4) === 0);

      if (headerValid) {
        // Get the ROM bank sizes and do a file size check
        const prgRomSize = data[4] * PRG_BANK_SIZE;
        const chrRomSize = data[5] * CHR_BANK_SIZE;
        const romFileSize = HEADER_SIZE + prgRomSize + chrRomSize;
        headerValid = romFileSize === data.length;

        if (headerValid) {
          this._prgRom = data.slice(HEADER_SIZE, HEADER_SIZE + prgRomSize);
          this._chrRom = data.slice(HEADER_SIZE + prgRomSize);
          this._mapperId = ((data[6] & 0xf0) >> 0x4) | (data[7] & 0xf0);
        } else {
          console.error(`ROM size is different from expected. Expected: ${romFileSize}, Actual: ${data.length}`);
        }
      } else {
        console.error('Invalid iNES header signature');
      }

      return headerValid;
    }

  }

  return Rom;

}());
(function() {

  const { RomSolutions } = window;

  let prgRomSize;
  let chrRomSize;
  let file;

  function bindEvents() {
    document.getElementById('rom-file').addEventListener('change', handleFileSelected);
  }

  function emptyEl($el) {
    while ($el.firstChild) {
      $el.removeChild($el.firstChild);
    }
  }

  function _createRomInfoRow(title, value) {
    const $row = document.createElement('tr');
    const $th = document.createElement('th');
    $th.className = 'rom-info__title';
    $th.appendChild(document.createTextNode(title));
    $row.appendChild($th);
    const $td = document.createElement('td');
    $td.className = 'rom-info__value';
    $td.appendChild(document.createTextNode(value));
    $row.appendChild($td);
    return $row;
  }

  function displayRomInfo(rom) {
    const $infoTable = document.getElementById('ines-info');
    emptyEl($infoTable);
    const $tbody = document.createElement('tbody');
    $tbody.appendChild(_createRomInfoRow('PRG-ROM size', `${rom.prgRomSize / 1024}KB`));
    $tbody.appendChild(_createRomInfoRow('CHR-ROM size', `${rom.chrRomSize / 1024}KB`));
    $tbody.appendChild(_createRomInfoRow('Mapper ID', rom.mapperId));
    if (rom.mapperName != rom.mapperId) {
      $tbody.appendChild(_createRomInfoRow('Mapper Name', rom.mapperName));
    }
    $infoTable.appendChild($tbody);
  }

  async function handleFileSelected(evt) {
    const file = evt.target.files[0];

    try {
      const rom = new RomSolutions();
      await rom.load(file);
      displayRomInfo(rom);
    } catch (exc) {
      console.error(exc);
    }
  }

  function domInit() {
    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', domInit);

}());
(function() {

  const { romSolutions } = window;

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

  function displayRomInfo(romInfo) {
    const $infoTable = document.getElementById('ines-info');
    emptyEl($infoTable);
    const $tbody = document.createElement('tbody');
    $tbody.appendChild(_createRomInfoRow('PRG-ROM size', `${romInfo.prgSize / 1024}KB`));
    $tbody.appendChild(_createRomInfoRow('CHR-ROM size', `${romInfo.chrSize / 1024}KB`));
    $tbody.appendChild(_createRomInfoRow('Mapper ID', romInfo.mapperId));
    if (romInfo.mapperName) {
      $tbody.appendChild(_createRomInfoRow('Mapper Name', romInfo.mapperName));
    }
    $infoTable.appendChild($tbody);
  }

  async function handleFileSelected(evt) {
    const file = evt.target.files[0];

    try {
      const romInfo = await romSolutions.getROMInfo(file);
      displayRomInfo(romInfo);
    } catch (exc) {
      console.error(exc);
    }
  }

  function domInit() {
    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', domInit);

}());
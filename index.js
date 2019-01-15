(function() {

  const { RomSolutions } = window;

  const ONE_KB = 1024;
  const ROM_INFO_EMPTY = 'rom-info--empty';
  const STEP_HIDDEN = 'step--hidden';

  // Elements
  let $infoTable;
  let $stepChips;
  let $stepDownload;
  let $prgSize;
  let $chrSize;
  let $generateBinaries;

  let currentRom;
  let currentRomName;

  function emptyEl($el) {
    while ($el.firstChild) {
      $el.removeChild($el.firstChild);
    }
  }

  function bindEvents() {
    document.getElementById('rom-file').addEventListener('change', handleFileSelected);
    $generateBinaries.addEventListener('click', handleGenerateBinariesClick);
    $prgSize.addEventListener('change', handleChipSizeChange);
    $chrSize.addEventListener('change', handleChipSizeChange);
  }

  function createRomInfoRow(title, value) {
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

  function createEpromDownloadButton(srcRom, destSize, fileExt, buttonText) {
    const $col = document.createElement('div');
    $col.className = 'step__col';
    const eprom = RomSolutions.createEpromBinary(srcRom, destSize);
    const urlBlob = URL.createObjectURL(eprom);
    const $link = document.createElement('a');
    $link.className = 'step__button';
    $link.textContent = buttonText;
    $link.href = urlBlob;
    $link.download = `${currentRomName}.${fileExt}.bin`;
    $col.appendChild($link);
    return $col;
  }

  function updateDropdownsForRom() {
    [
      [ 'prg-size', 'prgRomSize' ],
      [ 'chr-size', 'chrRomSize' ]
    ].forEach(([ elementId, romProp ]) => {
      const $el = document.getElementById(elementId);
      $el.querySelectorAll('option').forEach($option => {
        const romSize = $option.value * 1024;
        $option.disabled = romSize < currentRom[romProp];
      });
    });
    handleChipSizeChange();
  }

  function resetUi() {
    $infoTable.classList.add(ROM_INFO_EMPTY);
    $stepChips.classList.add(STEP_HIDDEN);
    $stepDownload.parentNode.classList.add(STEP_HIDDEN);
  }

  function displayRomInfo() {
    emptyEl($infoTable);
    const $tbody = document.createElement('tbody');
    $tbody.appendChild(createRomInfoRow('PRG-ROM size', `${currentRom.prgRomSize / ONE_KB}KB`));
    $tbody.appendChild(createRomInfoRow('CHR-ROM size', `${currentRom.chrRomSize / ONE_KB}KB`));
    $tbody.appendChild(createRomInfoRow('Mapper ID', currentRom.mapperId));
    if (currentRom.mapperName != currentRom.mapperId) {
      $tbody.appendChild(createRomInfoRow('Mapper Name', currentRom.mapperName));
    }
    $infoTable.appendChild($tbody);
    $infoTable.classList.remove(ROM_INFO_EMPTY);

    // Show the chip select step
    $stepChips.classList.remove(STEP_HIDDEN);
    updateDropdownsForRom();
  }

  async function handleFileSelected(evt) {
    resetUi();

    const [ file ] = evt.target.files;
    try {
      currentRomName = file.name.split('.');
      currentRomName.pop();
      currentRomName = currentRomName.join('.');

      currentRom = new RomSolutions();
      await currentRom.load(file);
      displayRomInfo();
    } catch (exc) {
      console.error(exc);
    }
  }

  function handleChipSizeChange(evt) {
    $generateBinaries.disabled = !($prgSize.value > 0 && $chrSize.value > 0);
  }

  function handleGenerateBinariesClick(evt) {
    const $prgDownload = createEpromDownloadButton(
      currentRom.prgRom, $prgSize.value * ONE_KB, 'prg', 'Download PRG-ROM'
    );
    const $chrDownload = createEpromDownloadButton(
      currentRom.chrRom, $chrSize.value * ONE_KB, 'chr', 'Download CHR-ROM'
    );
    emptyEl($stepDownload);
    $stepDownload.appendChild($prgDownload);
    $stepDownload.appendChild($chrDownload);
    $stepDownload.parentNode.classList.remove(STEP_HIDDEN);
  }

  function domInit() {
    $infoTable = document.getElementById('ines-info');
    $stepChips = document.getElementById('step-chips');
    $stepDownload = document.getElementById('step-download');
    $prgSize = document.getElementById('prg-size');
    $chrSize = document.getElementById('chr-size');
    $generateBinaries = document.getElementById('generate-binaries');

    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', domInit);

}());
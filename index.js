(function() {

  const { romSolutions } = window;

  let prgRomSize;
  let chrRomSize;
  let file;

  function bindEvents() {
    document.getElementById('rom-file').addEventListener('change', handleFileSelected);
  }

  /**
   *
   * @param {FileEvent} evt
   */
  async function handleFileSelected(evt) {
    const file = evt.target.files[0];

    try {
      const isValid = await romSolutions.getROMInfo(file);
    } catch (exc) {
      console.error(exc);
    }
  }

  function domInit() {
    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', domInit);

}());
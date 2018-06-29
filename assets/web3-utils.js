/* global web3 */

const { Web3 } = window

/**
 * Display the modal window with a title and an html message. If title === 'Hide', hide the window immediately
 * @param {string} title - Header of the modal window
 * @param {string} message - Message to display. HTML formatted
 * @param {boolean} remind - has the message already been displayed
 */
const modalMessage = (title, message, remind = false) => {
  if (remind === false && title !== 'Hide') {
    return
  }

  const modal = document.getElementById('myModal')
  const span = document.getElementsByClassName('close')[0]
  const header = document.getElementsByClassName('modal-header')[0].firstElementChild
  const text = document.getElementsByClassName('modal-message')[0]

  header.innerHTML = title
  text.innerHTML = message

  span.onclick = () => {
    modal.style.display = 'none'
  }

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none'
    }
  }

  if (title === 'Hide') {
    modal.style.display = 'none'
  } else {
    modal.style.display = 'block'
  }
}

/**
 * Insert metamask logo inside the header
 */
// eslint-disable-next-line no-unused-vars
const insertMetamaskLogo = () => {
  const MetamaskLogo = require('metamask-logo')

  const viewer = MetamaskLogo({
    pxNotRatio: true,
    width: 50,
    height: 40,
    followMouse: true,
    slowDrift: false
  })

  document.getElementsByClassName('metamask-logo-container')[0]
    .appendChild(viewer.container)
}

/**
 * Check if web3 is properly configured. If not, it prompt a modal window with information on how to configure it
 * @returns {Promise<{error: {title: string, message: string}}>} - Is web3 properly configured
 */
const checkWeb3Network = () => {
  return new Promise((resolve, reject) => {
    if (typeof web3 === 'undefined') {
      resolve({
        error: {
          title: 'Please install Metamask',
          message: 'We weren\' able to detect your Metamask installation. You can go to our tutorial by click the button below'
        }
      })
      return
    }
    web3 = new Web3(web3.currentProvider)
    if (web3.eth.accounts.length === 0) {
      resolve({
        error: {
          title: 'Please unlock Metamask',
          message: '<img width="100%" src="/gitbook/gitbook-plugin-exercises/tutorials/unlock_metamask.gif"/>'
        }
      })
      return
    }
    if (window.location.hostname === 'localhost') {
      resolve({ error: undefined })
      return
    }

    web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case '806':
          // User on our network, nothing to do
          resolve({ error: undefined })
          break
        default:
          resolve({
            error: {
              title: 'Select https://net.achievement.network on Metamask',
              message: '<img width="100%" src="/gitbook/gitbook-plugin-exercises/tutorials/change_network.gif"/>'
            }
          })
      }
    })
  })
}

module.exports = {
  checkWeb3Network: checkWeb3Network,
  modalMessage: modalMessage
}
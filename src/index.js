import 'babel-polyfill'
import 'classlist-polyfill'
import 'sightglass'
import _ from 'lodash'
import rivets from 'rivets'
import Stickyfill from 'stickyfill'
import model from './model'
import hero from './hero'
import initSiteDesc from './site-desc'
import imageZoomHint from './image-zoom-hint'
import footerSetup from './footer-setup'
import photoswipeSetup from './photoswipe-setup'
import {$, $$} from './util'
import './config'
import heroes from '../liquid/heroes'
import runGallery from './gallery'
import imagesLoaded from 'imagesloaded'
import loadMap from './map'

function init() {
  hero()
  initSiteDesc()
  imageZoomHint()
  footerSetup()

  const b = document.getElementsByTagName('body')[0],
        width = window.innerWidth ||
                document.documentElement.clientWidth ||
                b.clientWidth;

  if (width > 760) {
    const stickyfill = Stickyfill()
    $$('.sticky').forEach(el => stickyfill.add(el))
  }

  if (window.isGallery) {
    const div = $('.thumbnails'),
          thumbs = $$('.pswp-thumb');

    const galleryRunner = _.partial(runGallery, div)
    imagesLoaded(div, () => {
      photoswipeSetup(
        div,
        thumbs,
        heroes.map(({src, title}, i) => ({
          src,
          title,
          w: thumbs[i].naturalWidth,
          h: thumbs[i].naturalHeight
        }))
      )
      galleryRunner()
    })
    window.addEventListener('resize', _.throttle(galleryRunner, 100, {leading: false}))
  }

  if (window.isArticle) {
    const div = $('.post-content'),
          thumbs = $$('.post-content img');

    imagesLoaded(div, () => {
      photoswipeSetup(
        div,
        thumbs,
        thumbs.map(({src, naturalWidth, naturalHeight}) => ({
          src,
          w: naturalWidth,
          h: naturalHeight
        }))
      )
    })
  }

  if (window.isMap) {
    loadMap($('#map'))
  }

  rivets.bind(b, model)

  // window.rivets = rivets
  // window.model = model

  document.removeEventListener("DOMContentLoaded", init, false)
}

document.addEventListener('DOMContentLoaded', init, false)

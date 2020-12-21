import Phaser, { FacebookInstantGamesLeaderboard } from 'phaser'

import WebFontLoader from 'webfontloader'

export default class WebFontFile extends Phaser.Loader.File 
{
  loader: Phaser.Loader.LoaderPlugin
  fontNames?: string | string[]
  service?: string
  fontsLoadedCount: number

  constructor( loader, fontNames, service= 'google'){
    super(loader, {
      type: 'webfont',
      key: fontNames.toString()
    })

    this.fontNames = Array.isArray(fontNames) ? fontNames: [fontNames]
    this.service = service

    this.fontsLoadedCount = 0; 

  } 

  load(){
    const config = {
      fontactive: (familyName) => {
        this.checkLoadedFonts(familyName)
      }, 
      fontinactive: (familyName) => {
        this.checkLoadedFonts(familyName)
      }
    }

    switch(this.service){
      case 'google': 
        config['google'] = this.getGoogleConfig()
        break

      case 'adobe-edge': 
        config['typekit'] = this.getAdobeEdgeConfig()

      default: 
        throw new Error('Unsupported font service')
    }

    WebFontLoader.load(config)
  }

  getGoogleConfig() {
    return {
      families: this.fontNames
    }
  }

  getAdobeEdgeConfig() {
    return {
      id: (<string[]> this.fontNames).join(';'),
      api: '//use.edgefonts.net'
    }
  }

  checkLoadedFonts(familyName){
    if(this.fontNames.indexOf(familyName) < 0){
      return
    }

    ++ this.fontsLoadedCount

    if(this.fontsLoadedCount >= this.fontNames.length){
      this.loader.nextFile(this, false)
    }
  }
}
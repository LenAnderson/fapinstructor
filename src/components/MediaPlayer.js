import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

const styles = theme => ({
  video: {
    width: "100%",
    height: "99%"
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundSize: "contain",
    backgroundPosition: "top center",
    backgroundRepeat: "no-repeat"
  },
  youtube: {
    width: "99%",
    height: "90%"
  }
});

const videos = [
  "WEBM",
  "OGG",
  "MPG",
  "MP2",
  "MPEG",
  "MPE",
  "MPV",
  "MP4",
  "M4P",
  "M4V"
];
const images = [
  "ASE",
  "ART",
  "BMP",
  "BLP",
  "CD5",
  "CIT",
  "CPT",
  "CR2",
  "CUT",
  "DDS",
  "DIB",
  "DJVU",
  "EGT",
  "EXIF",
  "GIF",
  "GPL",
  "GRF",
  "ICNS",
  "ICO",
  "IFF",
  "JNG",
  "JPEG",
  "JPG",
  "JFIF",
  "JP2",
  "JPS",
  "LBM",
  "MAX",
  "MIFF",
  "MNG",
  "MSP",
  "NITF",
  "OTA",
  "PBM",
  "PC1",
  "PC2",
  "PC3",
  "PCF",
  "PCX",
  "PDN",
  "PGM",
  "PI1",
  "PI2",
  "PI3",
  "PICT",
  "PCT",
  "PNM",
  "PNS",
  "PPM",
  "PSB",
  "PSD",
  "PDD",
  "PSP",
  "PX",
  "PXM",
  "PXR",
  "QFX",
  "RAW",
  "RLE",
  "SCT",
  "SGI",
  "RGB",
  "INT",
  "BW",
  "TGA",
  "TIFF",
  "TIF",
  "VTF",
  "XBM",
  "XCF",
  "XPM",
  "3DV",
  "AMF",
  "AI",
  "AWG",
  "CGM",
  "CDR",
  "CMX",
  "DXF",
  "E2D",
  "EGT",
  "EPS",
  "FS",
  "GBR",
  "ODG",
  "SVG",
  "STL",
  "VRML",
  "X3D",
  "SXD",
  "V2D",
  "VND",
  "WMF",
  "EMF",
  "ART",
  "XAR",
  "PNG",
  "WEBP",
  "JXR",
  "HDP",
  "WDP",
  "CUR",
  "ECW",
  "IFF",
  "LBM",
  "LIFF",
  "NRRD",
  "PAM",
  "PCX",
  "PGF",
  "SGI",
  "RGB",
  "RGBA",
  "BW",
  "INT",
  "INTA",
  "SID",
  "RAS",
  "SUN",
  "TGA"
];

const isImage = url =>
  images.includes(
    url
      .split(".")
      .pop()
      .toUpperCase()
      .toUpperCase()
  );

const isVideo = url =>
  videos.includes(
    url
      .split(".")
      .pop()
      .toUpperCase()
      .toUpperCase()
  );

const isYouTube = url => url.includes("www.youtube-nocookie.com");

class MediaPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.playCount = 0;
  }

  repeatForDuration(evt) {
    if (this.props.loopShortVideos && evt.target.duration * (++this.playCount) < this.props.duration) {
      evt.target.play();
    } else {
      this.playCount = 0;
      this.props.onEnded(evt);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isImage(nextProps.url)) {
      if (this.props.url !== nextProps.url || !this.timeout) {
        clearInterval(this.timeout);
        this.timeout = setTimeout(nextProps.onEnded, nextProps.duration * 1000);
      }
    }
  }

  render() {
    const { classes, url, onEnded, muted } = this.props;

    if (isVideo(url)) {
      return (
        <video
          className={classes.video}
          src={url}
          style={{
            pointerEvents: `none`
          }}
          autoPlay
          muted={muted}
          onError={onEnded}
          onEnded={this.repeatForDuration.bind(this)}
        />
      );
    } else if (isImage(url)) {
      return (
        <div
          className={classes.image}
          style={{
            backgroundImage: `url(${url})`
          }}
        />
      );
    } else if (isYouTube(url)) {
      return (
        <iframe
          title="youtube"
          className={classes.youtube}
          src={url}
          frameBorder="0"
          allowFullScreen
        />
      );
    } else {
      return "unavailable format";
    }
  }
}

MediaPlayer.defaultProps = {
  muted: false
};

MediaPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  onEnded: PropTypes.func.isRequired,
  duration: PropTypes.number,
  muted: PropTypes.bool
};

export default withStyles(styles)(MediaPlayer);

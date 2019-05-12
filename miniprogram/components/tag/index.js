import { VantComponent } from '../common/component';
var DEFAULT_COLOR = '#999';
var COLOR_MAP = {
  danger: '#f44',
  primary: '#38f',
  success: '#06bf04'
};
VantComponent({
  props: {
    size: String,
    type: String,
    mark: Boolean,
    color: String,
    plain: Boolean,
    round: Boolean,
    textColor: String
  },
  computed: {
    classes: function classes() {
      var data = this.data;
      return this.classNames('van-tag', 'custom-class', {
        'van-tag--mark': data.mark,
        'van-tag--plain': data.plain,
        'van-tag--round': data.round,
        ["van-tag--" + data.size]: data.size,
        'van-hairline--surround': data.plain
      });
    },
    style: function style() {
      var color = this.data.color || COLOR_MAP[this.data.type] || DEFAULT_COLOR;
      var key = this.data.plain ? 'color' : 'background-color';
      var style = key + ": " + color;
      if (this.data.textColor) {
        style += "; color: " + this.data.textColor
      } else {
        // no text color case
        var textColor = this.generateTextColor(this.data.color)
        if (textColor !== null) {
          style += "; color: " + textColor
        }
      }
      return style;
    }
  },
  // methods
  methods: {
    generateTextColor(color) {
      if (color === null ||
        color === undefined ||
        color.indexOf("#") !== 0) {
        return null
      }
      var r, g, b
      if (color.length == 4) {
        // eg:#fff
        var rText = color.substr(1, 1)
        var gText = color.substr(2, 1)
        var bText = color.substr(3, 1)
        r = parseInt(`${rText}${rText}`, 16)
        g = parseInt(`${gText}${gText}`, 16)
        b = parseInt(`${bText}${bText}`, 16)
      } else if (color.length == 7) {
        // eg: #ffffff
        r = parseInt(`${color.substr(1, 2)}`, 16)
        g = parseInt(`${color.substr(3, 2)}`, 16)
        b = parseInt(`${color.substr(5, 2)}`, 16)
      }
      if (r !== undefined && g !== undefined && b !== undefined) {
        if (r >= 153 && g >= 110 && b > 10) {
          return '#000'
        } else {
          return '#fff'
        }
      }
      return null
    }
  }
});
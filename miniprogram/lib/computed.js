module.exports = Behavior({
  lifetimes: {
    created() {
      this._computedCache = {}
      this._originalSetData = this.setData
      this.setData = this._setData
      this._doingSetData = false
      this._doingSetProps = false
    }
  },
  definitionFilter(defFields) {
    const computed = defFields.computed || {}
    const computedKeys = Object.keys(computed)
    const properties = defFields.properties || {}
    const propertyKeys = Object.keys(properties)

    // 计算 computed
    const calcComputed = (scope) => {
      const needUpdate = {}
      const computedCache = scope._computedCache || scope.data

      for (let i = 0, len = computedKeys.length; i < len; i++) {
        const key = computedKeys[i]
        const getter = computed[key]

        if (typeof getter === 'function') {
          const value = getter.call(scope)

          if (computedCache[key] !== value) {
            needUpdate[key] = value
            computedCache[key] = value
          }
        }
      }

      return needUpdate
    }

    // 初始化 computed
    const initComputed = () => {
      defFields.data = defFields.data || {}

      // 先将 properties 里的字段写入到 data 中
      const data = defFields.data
      const hasOwnProperty = Object.prototype.hasOwnProperty
      if (propertyKeys.length) {
        // eslint-disable-next-line complexity
        Object.keys(properties).forEach(key => {
          const value = properties[key]
          let oldObserver

          // eslint-disable-next-line max-len
          if (value === null || value === Number || value === String || value === Boolean || value === Object || value === Array) {
            properties[key] = {
              type: value,
            }
          } else if (typeof value === 'object') {
            if (hasOwnProperty.call(value, 'value')) {
              // 处理值
              data[key] = value.value
            }

            if (hasOwnProperty.call(value, 'observer') && typeof value.observer === 'function') {
              oldObserver = value.observer
            }
          }

          // 追加 observer，用于监听变动
          properties[key].observer = function (...args) {
            const originalSetData = this._originalSetData

            if (this._doingSetProps) {
              // 调用 setData 设置 properties
              if (oldObserver) oldObserver.apply(this, args)
              return
            }

            if (this._doingSetData) {
              // eslint-disable-next-line no-console
              console.warn('can\'t call setData in computed getter function!')
              return
            }

            this._doingSetData = true

            // 计算 computed
            const needUpdate = calcComputed(this)

            // 做 computed 属性的 setData
            originalSetData.call(this, needUpdate)

            this._doingSetData = false

            if (oldObserver) oldObserver.apply(this, args)
          }
        })
      }

      // 计算 computed
      calcComputed(defFields)
    }

    initComputed()

    defFields.methods = defFields.methods || {}
    defFields.methods._setData = function (data, callback) {
      const originalSetData = this._originalSetData

      if (this._doingSetData) {
        // eslint-disable-next-line no-console
        console.warn('can\'t call setData in computed getter function!')
        return
      }

      this._doingSetData = true

      // TODO 过滤掉 data 中的 computed 字段
      const dataKeys = Object.keys(data)
      for (let i = 0, len = dataKeys.length; i < len; i++) {
        const key = dataKeys[i]

        if (computed[key]) delete data[key]
        if (!this._doingSetProps && propertyKeys.indexOf(key) >= 0) this._doingSetProps = true
      }

      // 做 data 属性的 setData
      originalSetData.call(this, data, callback)

      // 计算 computed
      const needUpdate = calcComputed(this)

      // 做 computed 属性的 setData
      originalSetData.call(this, needUpdate)

      this._doingSetData = false
      this._doingSetProps = false
    }
  }
})
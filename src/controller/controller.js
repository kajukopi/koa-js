export default {
  index: function* () {
    console.log(this.body)
    yield this.render("index")
  },
}

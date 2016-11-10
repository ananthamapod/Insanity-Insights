import gulp from 'gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import minifycss from 'gulp-minify-css'
import concat from 'gulp-concat'
import pump from 'pump'

const srcs = {
    sass: "src/sass/*.scss",
    css: "src/css/*.css"
  },
  dests = {
    sass: "src/css",
    css: "public/css"
  }

gulp.task('sass', (cb) => {
  pump(
    [
      gulp.src("src/sass/main.scss"),
      sass(),
      gulp.dest(dests.sass)
    ],
    cb
  )
})

gulp.task('css', ['sass'], (cb) => {
  pump(
    [
      gulp.src(srcs.css),
      concat('style.css'),
      autoprefixer('last 2 versions'),
      minifycss(),
      gulp.dest(dests.css)
    ],
    cb
  )
})

gulp.task('watch', () => {
  gulp.watch(srcs.sass, ['sass', 'css'])
})

gulp.task('default', ['watch'])

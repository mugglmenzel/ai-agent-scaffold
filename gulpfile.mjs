/*
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import gulp from 'gulp';
import { deleteAsync } from 'del';
import beautify from 'gulp-beautify';
import eslint  from 'gulp-eslint';
import nodeSass from 'node-sass';
import gulpSass from 'gulp-sass';

const { series, parallel, src, dest, task } = gulp;
const sass = gulpSass(nodeSass);

sass.compiler = nodeSass;

const prepareDist = () => src(['app/**'], {allowEmpty: false}).
    pipe(dest('dist/'));

const cleanOutput = () => deleteAsync(['dist/static/**']);

const lintCode = () => src(['app/static/**/*.js']).
    pipe(eslint({configFile: 'app/.eslintrc.json'})).
    pipe(eslint.format());

const beautifyCode = () => src(['app/static/**/*.js']).
    pipe(beautify({
      indent_size: 2,
      preserve_newlines: false,
    })).
    pipe(dest('dist/static/'));

const compileSass = () => src(['app/static/scss/**']).
    pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)).
    pipe(dest('dist/static/css/'));

const copyImages = () => src(['app/static/img/**'], {allowEmpty: true}).
    pipe(dest('dist/static/img/'));

export default series(
    prepareDist, cleanOutput,
    parallel(lintCode, 
                 beautifyCode, 
                 compileSass, 
                 copyImages)
);


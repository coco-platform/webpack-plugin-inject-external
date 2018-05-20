/**
 * @description - provide several tool for core implement
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const _ = require('lodash');
const yaml = require('node-yaml');
const chalk = require('chalk');

/**
 * @description - find all external modules
 *
 * @param {Compilation} compilation
 *
 * @return {Array.<string>}
 */
function findExternalModules(compilation) {
  return (
    compilation.modules
      .filter((module) => module.external)
      .map((external) => external.userRequest)
      // ignore special relative external path
      .filter((name) => !name.startsWith('.'))
  );
}

/**
 * @description - parse yaml string into standard plugin recognizable hashMap
 *
 * @param {string} source
 * @param {string} [env=development]
 *
 * @return {object}
 */
function parseExternalDefinition(source, env = 'development') {
  const { library, environment } = yaml.parse(source);
  const share = _.isArray(library) ? library : [];
  const dedicated = _.get(environment, env, []);
  const resources = [...share, ...dedicated];

  return resources
    .map(
      (resource) =>
        _.isString(resource.linkage)
          ? _.assign({}, resource, { linkage: [resource.linkage] })
          : _.assign({}, resource)
    )
    .reduce(
      (acc, resource) =>
        _.assign({}, acc, {
          [resource.name]: resource.linkage,
        }),
      {}
    );
}

/**
 * @description - generate tag structure for webpack-plugin-html
 *
 * @param {Array.<string>} modules
 * @param {object} dictionary
 *
 * @return {{head,body}}
 */
function createTree(modules, dictionary) {
  const head = [];
  const body = [];
  const LinkExtension = /\.css$/;
  const ScriptExtension = /\.js$/;

  /* eslint-disable no-console */
  modules
    .filter((module) => {
      const valid = Reflect.has(dictionary, module);
      const warning = ` InjectExternalPlugin: Library --> ${module} marked as external, but have no related resource`;

      if (!valid) {
        console.log(chalk.red(warning));
      }

      return valid;
    })
    .reduce((acc, module) => [...acc, ...Reflect.get(dictionary, module)], [])
    .forEach((resource) => {
      if (LinkExtension.test(resource)) {
        head.push({
          tagName: 'link',
          closeTag: true,
          attributes: { rel: 'stylesheet', type: 'text/css', href: resource },
        });
      }

      if (ScriptExtension.test(resource)) {
        body.push({
          tagName: 'script',
          closeTag: true,
          attributes: {
            type: 'text/javascript',
            src: resource,
            crossorigin: 'anonymous',
          },
        });
      }
    });

  return { head, body };
  /* eslint-enable no-console */
}

module.exports = {
  findExternalModules,
  parseExternalDefinition,
  createTree,
};

const React = require('react');

const createMockComponent = (name) => {
  const Component = (props) => {
    return React.createElement(name, props, props.children);
  };
  Component.displayName = name;
  return Component;
};

module.exports = {
  __esModule: true,
  default: createMockComponent('Svg'),
  Svg: createMockComponent('Svg'),
  Circle: createMockComponent('Circle'),
  Rect: createMockComponent('Rect'),
  Path: createMockComponent('Path'),
  Line: createMockComponent('Line'),
  G: createMockComponent('G'),
  Text: createMockComponent('SvgText'),
};

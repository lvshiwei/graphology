/**
 * Graphology Events Specs
 * ========================
 *
 * Testing the graph's events.
 */
import assert from 'assert';
import {spy} from './helpers';

const VALID_TYPES = new Set(['set', 'merge', 'replace', 'remove']);

export default function events(Graph) {
  return {
    'nodeAdded': {
      'it should fire when a node is added.': function() {
        const graph = new Graph();

        const handler = spy(data => {
          assert.strictEqual(data.key, 'John');
          assert.deepEqual(data.attributes, {age: 34});
        });

        graph.on('nodeAdded', handler);

        graph.addNode('John', {age: 34});

        assert(handler.called);
      }
    },

    'edgeAdded': {
      'it should fire when an edge is added.': function() {
        const graph = new Graph();

        const handler = spy(data => {
          assert.strictEqual(data.key, 'J->T');
          assert.deepEqual(data.attributes, {weight: 1});
          assert.strictEqual(data.source, 'John');
          assert.strictEqual(data.target, 'Thomas');
          assert.strictEqual(data.undirected, false);
        });

        graph.on('edgeAdded', handler);

        graph.addNodesFrom(['John', 'Thomas']);
        graph.addEdgeWithKey('J->T', 'John', 'Thomas', {weight: 1});

        assert(handler.called);
      }
    },

    'nodeDropped': {
      'it should fire when a node is dropped.': function() {
        const graph = new Graph();

        const handler = spy(data => {
          assert.strictEqual(data.key, 'John');
          assert.deepEqual(data.attributes, {age: 34});
        });

        graph.on('nodeDropped', handler);

        graph.addNode('John', {age: 34});
        graph.dropNode('John');

        assert(handler.called);
      }
    },

    'edgeDropped': {
      'it should fire when an edge is added.': function() {
        const graph = new Graph();

        const handler = spy(data => {
          assert.strictEqual(data.key, 'J->T');
          assert.deepEqual(data.attributes, {weight: 1});
          assert.strictEqual(data.source, 'John');
          assert.strictEqual(data.target, 'Thomas');
          assert.strictEqual(data.undirected, false);
        });

        graph.on('edgeDropped', handler);

        graph.addNodesFrom(['John', 'Thomas']);
        graph.addEdgeWithKey('J->T', 'John', 'Thomas', {weight: 1});
        graph.dropEdge('J->T');

        assert(handler.called);
      }
    },

    'cleared': {
      'it should fire when the graph is cleared.': function() {
        const graph = new Graph();

        const handler = spy();

        graph.on('cleared', handler);

        graph.clear();

        assert(handler.called);
      }
    },

    'attributesUpdated': {
      'it should fire when a graph attribute is updated.': function() {
        const graph = new Graph();

        const handler = spy(payload => {
          const {type, meta} = payload;

          assert(VALID_TYPES.has(type));

          if (type === 'set') {
            assert.strictEqual(meta.name, 'name');
            assert.strictEqual(meta.value, 'Awesome graph');
          }
          else if (type === 'replace') {
            assert.deepEqual(meta.before, {name: 'Awesome graph'});
            assert.deepEqual(meta.after, {name: 'Shitty graph'});
          }
          else if (type === 'remove') {
            assert.strictEqual(meta.name, 'name');
          }
          else {
            assert.deepEqual(meta.data, {name: 'Shitty graph', author: 'John'});
          }
        });

        graph.on('attributesUpdated', handler);

        graph.setAttribute('name', 'Awesome graph');
        graph.replaceAttributes({name: 'Shitty graph'});
        graph.mergeAttributes({author: 'John'});
        graph.removeAttribute('name');

        assert.strictEqual(handler.times, 4);
      }
    },

    'nodeAttributesUpdated': {
      'it should fire when a node is updated.': function() {
        const graph = new Graph();

        const handler = spy(payload => {
          const {key, type, meta} = payload;

          assert.strictEqual(key, 'John');

          assert(VALID_TYPES.has(type));

          if (type === 'set') {
            assert.strictEqual(meta.name, 'age');
            assert.strictEqual(meta.value, 34);
          }
          else if (type === 'replace') {
            assert.deepEqual(meta.before, {age: 34});
            assert.deepEqual(meta.after, {age: 56});
          }
          else if (type === 'remove') {
            assert.strictEqual(meta.name, 'eyes');
          }
          else {
            assert.deepEqual(meta.data, {eyes: 'blue'});
          }
        });

        graph.on('nodeAttributesUpdated', handler);

        graph.addNode('John');
        graph.setNodeAttribute('John', 'age', 34);
        graph.replaceNodeAttributes('John', {age: 56});
        graph.mergeNodeAttributes('John', {eyes: 'blue'});
        graph.removeNodeAttribute('John', 'eyes');

        assert.strictEqual(handler.times, 4);
      }
    },

    'edgeAttributesUpdated': {
      'it should fire when a node is updated.': function() {
        const graph = new Graph();

        const handler = spy(payload => {
          const {key, type, meta} = payload;

          assert.strictEqual(key, 'J->T');

          assert(VALID_TYPES.has(type));

          if (type === 'set') {
            assert.strictEqual(meta.name, 'weight');
            assert.strictEqual(meta.value, 34);
          }
          else if (type === 'replace') {
            assert.deepEqual(meta.before, {weight: 34});
            assert.deepEqual(meta.after, {weight: 56});
          }
          else if (type === 'remove') {
            assert.strictEqual(meta.name, 'type');
          }
          else {
            assert.deepEqual(meta.data, {type: 'KNOWS'});
          }
        });

        graph.on('edgeAttributesUpdated', handler);

        graph.addNodesFrom(['John', 'Thomas']);
        graph.addEdgeWithKey('J->T', 'John', 'Thomas');
        graph.setEdgeAttribute('J->T', 'weight', 34);
        graph.replaceEdgeAttributes('J->T', {weight: 56});
        graph.mergeEdgeAttributes('J->T', {type: 'KNOWS'});
        graph.removeEdgeAttribute('J->T', 'type');

        assert.strictEqual(handler.times, 4);
      }
    }
  };
}

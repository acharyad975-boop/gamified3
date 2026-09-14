import React from 'react';
import PrintExecutionAnimation from './PrintExecutionAnimation';
import VariableAnimation from './VariableAnimation';
import PythonLoopAnimation from './PythonLoopAnimation';
import WhileLoopAnimation from './WhileLoopAnimation';
import BreakContinueAnimation from './BreakContinueAnimation';
import FunctionCallStackAnimation from './FunctionCallStackAnimation';
import ReturnCallStackAnimation from './ReturnCallStackAnimation';
import ListArrayAnimation from './ListArrayAnimation';
import DictionaryAnimation from './DictionaryAnimation';
import StackAnimation from './StackAnimation';
import SortingAnimation from './SortingAnimation';
import BinarySearchAnimation from './BinarySearchAnimation';
import SQLQueryAnimation from './SQLQueryAnimation';
import ReactStateAnimation from './ReactStateAnimation';
import NeuralNetworkAnimation from './NeuralNetworkAnimation';

const AnimationDispatcher = ({ animationType }) => {
  switch (animationType) {
    case 'python_print':
      return <PrintExecutionAnimation />;
    case 'variable':
    case 'variables_memory':
      return <VariableAnimation />;
    case 'python_loop':
    case 'for_loops':
      return <PythonLoopAnimation />;
    case 'while_loops':
      return <WhileLoopAnimation />;
    case 'break_continue':
      return <BreakContinueAnimation />;
    case 'functions_params':
      return <FunctionCallStackAnimation />;
    case 'return_callstack':
      return <ReturnCallStackAnimation />;
    case 'lists_tuples':
      return <ListArrayAnimation />;
    case 'dicts_sets':
      return <DictionaryAnimation />;
    case 'stack':
    case 'queue':
      return <StackAnimation />;
    case 'sorting':
      return <SortingAnimation />;
    case 'binary_search':
      return <BinarySearchAnimation />;
    case 'sql_query':
      return <SQLQueryAnimation />;
    case 'react_state':
      return <ReactStateAnimation />;
    case 'neural_network':
      return <NeuralNetworkAnimation />;
    default:
      return <PythonLoopAnimation />;
  }
};

export default AnimationDispatcher;

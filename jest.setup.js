

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

jest.mock('@react-native-async-storage/async-storage',()=>({
    AsyncStorage:jest.fn(),
    getItem:jest.fn()
  }))
  jest.mock('react-native-swipeout',()=>({
    Swipeout:jest.fn()
  }))


import React from 'react';
import { shallow } from 'enzyme';
import DetailScreen from '../src/DetailScreen';

describe('DetailScreen Component', () => {
  let wrapper;

  beforeEach(() => {
    // Create a shallow wrapper for the DetailScreen component
    const headline = {
      title: 'Sample Headline',
      description: 'This is a sample description.',
      urlToImage: 'https://example.com/sample-image.jpg',
      "source": {
        "id": null,
        "name": "Electrek"
      },
    };

    // Pass the headline as a prop
    wrapper = shallow(<DetailScreen headline={headline} />);
  });

  it('All the Ui load without error', () => {
    expect(wrapper.exists()).toBe(true);
    
  });

  it('User can back to the screen ', () => {
        wrapper.find({ testID: 'backBtn' }).simulate('press');
  });
  
});

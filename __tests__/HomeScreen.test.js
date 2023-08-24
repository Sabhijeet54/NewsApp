import React from 'react';
import { shallow } from 'enzyme';
import HomeScreen from '../src/HomeScreen';

describe('HomeScreen Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<HomeScreen />);
  });

  it('should render without errors', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('When data is loaded user can swipe and pin and delete the data ', () => {
    const item = [
      {
        "author": "Gert Verhoeven",
        "content": "Het Chinese CATL maakte bekend dat het een nieuwe LFP-batterij productierijp heeft die bijzonder snel laadt. CATL is een van de belangrijkste spelers op de markt van batterijen. De Chinese producent… [+1782 chars]",
        "description": "Het Chinese CATL maakte bekend dat het een nieuwe LFP-batterij productierijp heeft die bijzonder snel laadt. CATL is een van de belangrijkste spelers op de markt van batterijen. De Chinese producent levert batterijen voor de meest uiteenlopende toepassingen m…",
        "publishedAt": "2023-08-22T09:56:48Z",
        "source": {
          "id": null,
          "name": "Knack.be"
        },
        "title": "CATL komt met snelle batterij",
        "url": "https://www.knack.be/nieuws/catl-komt-met-snelle-batterij/",
        "urlToImage": "https://img.static-rmg.be/a/view/q75/w1600/h836/5384781/schermafbeelding-2023-08-19-om-19-17-25-png.png"
      },
      {
        "author": "Micah Toll",
        "content": "As electric bikes become increasingly popular in cities across the US, some in the media are trying to wrap their heads around this reported “electric bike craze.” But make no mistake, this isn’t som… [+6613 chars]",
        "description": "As electric bikes become increasingly popular in cities across the US, some in the media are trying to wrap their heads around this reported “electric bike craze.” But make no mistake, this isn’t some short-lived enthusiasm or a passing fad. This widespread a…",
        "publishedAt": "2023-08-22T09:55:56Z",
        "source": {
          "id": null,
          "name": "Electrek"
        },
        "title": "It’s not an ‘electric bike craze.’ You’re looking at the future of transportation",
        "url": "https://electrek.co/2023/08/22/electric-bike-craze-future-of-transportation/",
        "urlToImage": "https://i0.wp.com/electrek.co/wp-content/uploads/sites/3/2023/08/electra-ponto-go-e-bike-bike-header.jpg?resize=1200%2C628&quality=82&strip=all&ssl=1"
      }];

    wrapper.setState({headlines:item})
    let render_item = wrapper.findWhere(node=>node.prop("testID") === 'FlatListId')
    const renderItem = render_item.prop("renderItem")({ item, index: 0 });

    const Swipeout = wrapper.findWhere(node=>node.prop("testID") === 'SwipeoutID')
    Swipeout?.length>0&&Swipeout.simulate('right');

  });

  it('User can "Next" by button click', () => {
    const handleOpenDetail = wrapper.findWhere(node=>node.prop("testID") === 'handleOpenDetailid')
     handleOpenDetail?.length>0&& handleOpenDetail.simulate('right');
    

  });
  it('User can "Next" by button click', () => {
    const handleOpenDetail = wrapper.find({ testID: 'handleFetchNextBatchid' });
    handleOpenDetail.simulate('press');

  });

  
});

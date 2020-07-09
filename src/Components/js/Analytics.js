import ReactGA from 'react-ga';

function pageView(page){
    ReactGA.initialize('UA-136977966-1')
    ReactGA.pageview(page);
}

export { pageView }
import ReactGA from 'react-ga';

const isBrowser = typeof window !== "undefined"

function pageView(page){
    if(isBrowser)
    {
        if(window.location.hostname !== "localhost")
        {
            ReactGA.initialize('UA-136977966-1')
            ReactGA.pageview(page);
        }
    }
}

export { pageView }
import {useEffect, useState} from 'react';


export const REQUEST_CREDENTIAL_SAME_ORIGIN = 'same-origin';

export const HttpRequestMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

export const ContentTypes = {
    APPLICATION_URL_ENCODED: 'application/x-www-form-urlencoded; charset=UTF-8',
    APPLICATION_JSON: 'application/json; charset=UTF-8',
};

export const RequestStatus = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
};

export const Errors = {
    ABORT_ERROR: 'AbortError',
};

export const isAllSuccessful = (dependencies) => {
    if (!dependencies.length) return true;
    return dependencies.every((el) => el === RequestStatus.SUCCESS);
};

export const abortOnTimeOut = (timeOut, abortController) => {
    if (!timeOut) {
        return null;
    }

    return setTimeout(() => {
        abortController.abort();
    }, timeOut);
};

let timeoutId = 0;


const useFetch = ({url, options, callback, config = {}, method = HttpRequestMethods.GET}) => {
    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(RequestStatus.PENDING);
    const {
        dependencies = [],
        watch = true,
        enabled = true,
        isFetchOnLoad,
        shouldWatchUrl,
        timeOut,
    } = config;

    let abortController = new AbortController();

    const handleFetch = (signal) => {
        if (isAllSuccessful(dependencies) && watch && shouldFetch) {
            fetchData(signal).then(() => {
                if (shouldWatchUrl) setShouldFetch(false);
                callback && callback();
            });
            timeoutId = abortOnTimeOut(timeOut, abortController);
        }
    };

    useEffect(() => {
        setShouldFetch(true);
    }, [url]);

    useEffect(() => {
        if (!enabled) return undefined;
        abortController = new AbortController();
        handleFetch(abortController.signal);

        if (isFetchOnLoad) return () => abortController.abort();
        return undefined;
    }, [url, ...dependencies, watch, shouldFetch]);

    const fetchData = async (signal) => {
        if (!url) return;
        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch(url, {
                method,
                signal,
                credentials: REQUEST_CREDENTIAL_SAME_ORIGIN,
                ...options,
            });
            const responseData = await response.json();
            setStatus(RequestStatus.SUCCESS);
            setData(responseData);
        } catch (e) {
            setStatus(RequestStatus.ERROR);
            setError(e);
        } finally {
            clearTimeout(timeoutId);
            setIsLoading(false);
        }
    };

    return {data, isLoading, error, status, refetch: handleFetch};
};

export default useFetch;
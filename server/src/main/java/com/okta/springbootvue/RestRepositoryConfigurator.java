package com.okta.springbootvue;

import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import org.springframework.stereotype.Component;

/*
    IDs are not returned by RestRepository by default. I like them
    exposed so that the client can easily find the ID of created
    and listed resources.
 */
@Component
public class RestRepositoryConfigurator extends RepositoryRestConfigurerAdapter {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.exposeIdsFor(Todo.class);
    }

}
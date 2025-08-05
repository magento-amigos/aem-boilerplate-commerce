/*! Copyright 2025 Adobe
All Rights Reserved. */
import{FetchGraphQL as s}from"@dropins/tools/fetch-graphql.js";import{f as d,g as h,c,r as m,s as g,a as f,b as u,u as G}from"./chunks/updateCompany.js";import"@dropins/tools/event-bus.js";const{setEndpoint:r,setFetchGraphQlHeader:o,setFetchGraphQlHeaders:n}=new s().getMethods(),i=async(e={})=>(e.langDefinitions&&console.log("Language definitions set:",e.langDefinitions),e.models&&console.log("Data models configured:",e.models),{success:!0,config:e});export{d as fetchGraphQl,h as getCompany,c as getConfig,i as initialize,m as removeFetchGraphQlHeader,g as setEndpoint,f as setFetchGraphQlHeader,u as setFetchGraphQlHeaders,G as updateCompany};
//# sourceMappingURL=api.js.map

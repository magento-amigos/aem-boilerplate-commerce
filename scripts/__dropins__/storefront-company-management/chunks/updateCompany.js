/*! Copyright 2025 Adobe
All Rights Reserved. */
import{events as g}from"@dropins/tools/event-bus.js";import{FetchGraphQL as M}from"@dropins/tools/fetch-graphql.js";const{setEndpoint:O,setFetchGraphQlHeader:P,removeFetchGraphQlHeader:T,setFetchGraphQlHeaders:y,fetchGraphQl:a,getConfig:Y}=new M().getMethods(),d=r=>{throw r instanceof DOMException&&r.name==="AbortError"||g.emit("error",{source:"company",type:"network",error:r}),r},i=r=>{const e=r.map(t=>t.message).join(" ");throw Error(e)},C=`
  fragment COMPANY_LEGAL_ADDRESS_FRAGMENT on CompanyLegalAddress {
    street
    city
    region {
      region
      region_code
      region_id
    }
    country_code
    postcode
    telephone
  }
`,N=`
  fragment COMPANY_BASIC_INFO_FRAGMENT on Company {
    id
    name
    email
    legal_name
    vat_tax_id
    reseller_id
  }
`,E=`
  fragment COMPANY_ADMIN_FRAGMENT on Customer {
    id
    firstname
    lastname
    email
  }
`,_=`
  fragment COMPANY_FULL_FRAGMENT on Company {
    ...COMPANY_BASIC_INFO_FRAGMENT
    legal_address {
      ...COMPANY_LEGAL_ADDRESS_FRAGMENT
    }
    company_admin {
      ...COMPANY_ADMIN_FRAGMENT
    }
  }
  ${N}
  ${C}
  ${E}
`,p=`
  query GET_COMPANY {
    company {
      ...COMPANY_FULL_FRAGMENT
    }
    customer {
      role {
        id
        name
        permissions {
          id
          text
        }
      }
      status
    }
  }
  ${_}
`,l=r=>{var s;const e="updateCompany"in r.data?r.data.updateCompany.company:r.data.company,t="customer"in r.data?r.data.customer:void 0,c=e!=null&&e.legal_address?{street:e.legal_address.street||[],city:e.legal_address.city||"",region:e.legal_address.region?{region:e.legal_address.region.region||"",regionCode:e.legal_address.region.region_code||"",regionId:e.legal_address.region.region_id||0}:void 0,countryCode:e.legal_address.country_code||"",postcode:e.legal_address.postcode||"",telephone:e.legal_address.telephone}:void 0,n=t==null?void 0:t.role,o=((s=n==null?void 0:n.permissions)==null?void 0:s.map(m=>m.text))||[],A=o.includes("Magento_Company::company_edit")||o.includes("Magento_Company::edit_company_profile")||(n==null?void 0:n.name)==="Company Administrator";return{id:(e==null?void 0:e.id)||"",name:(e==null?void 0:e.name)||"",email:(e==null?void 0:e.email)||"",legal_name:e==null?void 0:e.legal_name,vat_tax_id:e==null?void 0:e.vat_tax_id,reseller_id:e==null?void 0:e.reseller_id,legal_address:c,company_admin:e==null?void 0:e.company_admin,canEdit:A,customerRole:n,customerStatus:t==null?void 0:t.status}},f=async()=>await a(p,{method:"GET",cache:"no-cache"}).then(r=>{var e;return(e=r.errors)!=null&&e.length?i(r.errors):l(r)}).catch(d),h=`
  mutation UPDATE_COMPANY($input: CompanyUpdateInput!) {
    updateCompany(input: $input) {
      company {
        ...COMPANY_FULL_FRAGMENT
      }
    }
  }
  ${_}
`,L=async r=>await a(h,{method:"POST",variables:{input:r}}).then(e=>{var t;return(t=e.errors)!=null&&t.length?i(e.errors):l(e)}).catch(d);export{P as a,y as b,Y as c,a as f,f as g,T as r,O as s,L as u};
//# sourceMappingURL=updateCompany.js.map

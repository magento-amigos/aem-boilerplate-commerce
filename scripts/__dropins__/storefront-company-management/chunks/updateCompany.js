/*! Copyright 2025 Adobe
All Rights Reserved. */
import{events as A}from"@dropins/tools/event-bus.js";import{FetchGraphQL as M}from"@dropins/tools/fetch-graphql.js";const{setEndpoint:O,setFetchGraphQlHeader:P,removeFetchGraphQlHeader:u,setFetchGraphQlHeaders:y,fetchGraphQl:s,getConfig:T}=new M().getMethods(),i=r=>{throw r instanceof DOMException&&r.name==="AbortError"||A.emit("error",{source:"company",type:"network",error:r}),r},_=r=>{const e=r.map(a=>a.message).join(" ");throw Error(e)},C=`
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
`,l=`
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
`,h=`
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
  ${l}
`,m=r=>{var d;const e="updateCompany"in r.data?r.data.updateCompany.company:r.data.company,a="customer"in r.data?r.data.customer:void 0,o=e!=null&&e.legal_address?{street:e.legal_address.street||[],city:e.legal_address.city||"",region:e.legal_address.region?{region:e.legal_address.region.region||"",regionCode:e.legal_address.region.region_code||"",regionId:e.legal_address.region.region_id||0}:void 0,countryCode:e.legal_address.country_code||"",postcode:e.legal_address.postcode||"",telephone:e.legal_address.telephone}:void 0,t=a==null?void 0:a.role,n=((d=t==null?void 0:t.permissions)==null?void 0:d.map(g=>g.text))||[],c=n.includes("Magento_Company::company_edit")||n.includes("Magento_Company::edit_company_profile")||(t==null?void 0:t.name)==="Company Administrator";return{id:(e==null?void 0:e.id)||"",name:(e==null?void 0:e.name)||"",email:(e==null?void 0:e.email)||"",legal_name:e==null?void 0:e.legal_name,vat_tax_id:e==null?void 0:e.vat_tax_id,reseller_id:e==null?void 0:e.reseller_id,legal_address:o,company_admin:e==null?void 0:e.company_admin,canEdit:c,customerRole:t,customerStatus:a==null?void 0:a.status}},v=async()=>await s(h,{method:"GET",cache:"no-cache"}).then(r=>{var e;return(e=r.errors)!=null&&e.length?_(r.errors):m(r)}).catch(i),F=`
  mutation UPDATE_COMPANY($input: CompanyUpdateInput!) {
    updateCompany(input: $input) {
      company {
        ...COMPANY_FULL_FRAGMENT
      }
    }
  }
  ${l}
`,Y=async r=>{const e={};return r.name!==void 0&&(e.company_name=r.name),r.email!==void 0&&(e.company_email=r.email),r.legal_name!==void 0&&(e.legal_name=r.legal_name),r.vat_tax_id!==void 0&&(e.vat_tax_id=r.vat_tax_id),r.reseller_id!==void 0&&(e.reseller_id=r.reseller_id),Object.keys(r).forEach(a=>{["name","email","legal_name","vat_tax_id","reseller_id"].includes(a)||(e[a]=r[a])}),await s(F,{method:"POST",variables:{input:e}}).then(a=>{var o;return(o=a.errors)!=null&&o.length?_(a.errors):m(a)}).catch(i)};export{P as a,y as b,T as c,s as f,v as g,u as r,O as s,Y as u};
//# sourceMappingURL=updateCompany.js.map

import Hashids from "hashids";

const hashids = new Hashids("pasal_saathi_salt",6); // 6-character minimum length

export default hashids;
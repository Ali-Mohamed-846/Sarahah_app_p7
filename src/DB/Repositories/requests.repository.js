import Requests from "../models/requests.model.js";
import BaseRepository from "./base.repository.js";

export default class RequestsRepository extends BaseRepository{
constructor(){
    super(Requests)
}
}

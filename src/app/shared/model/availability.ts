export class Availability {
  id: number;
  idshop: number;
  iduser: number;
  idactivity: number;
  idservice: number;
  service: string;
  keystaff: number;
  staff: string;
  date: string;
  idtime: number;
  time: string;
  idduration: number;
  observation: string;
  client: string;
  idclient: number;
  createdAt?: string;
  updatedAt?: string;
  clientname?: string;
  clientemail?: string;
  activity: string;
  duration: string;
  units: number;
  enabled?: string;

  public status: string;
  visible: boolean = true;

  constructor(
    className: string,
    id: number,
    idshop: number,
    iduser: number,
    idactivity: number,
    activity: string,
    idservice: number,
    service: string,
    keystaff: number,
    staff: string,
    date: string,
    idtime: number,
    time: string,
    idduration: number,
    duration: string,
    units: number,
    client: string,
    idclient: number,
    visible: boolean,
    observation: string
  ) {
    this.status = className;
    this.id = id;
    this.idshop = idshop;
    this.iduser = iduser;
    this.idactivity = idactivity;
    this.activity = activity;
    this.idservice = idservice;
    this.service = service;
    this.keystaff = keystaff;
    this.staff = staff;
    this.date = date;
    this.idtime = idtime;
    this.time = time;
    this.idduration = idduration;
    this.duration = duration;
    this.units = units;
    this.client = client;
    this.idclient = idclient;
    this.visible = visible;
    this.observation = observation;
  }
}

import config from './config';
import soap from 'soap';

export default class Ars {

  constructor(type) {
    this.type = type;
    this.url = config.url;
  }

  client() {
    return new Promise((resolve, reject) => {

      switch (this.type) {
        case 'change':
          this.url = this.url + "CHG_ChangeInterface_WS?wsdl";
          break;
        case 'incident':
          this.url = this.url + "HPD_IncidentInterface_WS?wsdl";
          break;
      }

      soap.createClient(this.url, config.soap_config, (err, client) => {

        if (err) reject(err);

        if (client) {
          client.addSoapHeader({
            "AuthenticationInfo": {
              "userName": config.username,
              "password": config.password
            }
          });

          resolve(client);
        }

      });
    });
  }

  find(args) {

    let qualification = '';
    let startRecord = 0;
    let maxLimit = 10;

    if (args) {
      qualification = args.qualification || '';
      startRecord = args.startRecord || 0;
      maxLimit = args.maxLimit || 10;
    }

    return new Promise((resolve, reject) => {
        this.client()
        .then((client) => {
          switch (this.type) {
            case 'change':
            client.Change_QueryList_Service({
              'Qualification' : qualification,
              'startRecord' : startRecord,
              'maxLimit' : maxLimit
            }, (err, result, raw, soapHeader) => {
                 if (err) { reject(err); }
                 resolve(result.getListValues);
             }, config.soap_config.wsdl_options);
              break;
            case 'incident':
              client.HelpDesk_QueryList_Service({
                'Qualification' : qualification,
                'startRecord' : startRecord,
                'maxLimit' : maxLimit
              }, (err, result, raw, soapHeader) => {
                   if (err) { reject(err); }
                   resolve(result.getListValues);
               }, config.soap_config.wsdl_options);
              break;
          }
        })
        .catch((err) => reject(err));
    });
  }
}

// Target Interface
interface USBTypeC {
    chargeWithTypeC(): void;
  }
  
  // Adaptee (Incompatible Interface)
  class MicroUSBCharger {
    chargeWithMicroUSB(): void {
      console.log("Charging with Micro-USB charger.");
    }
  }
  
  // Adapter (Converts Micro-USB to USB-C)
  class MicroUSBToTypeCAdapter implements USBTypeC {
    private microUSBCharger: MicroUSBCharger;
  
    constructor(microUSBCharger: MicroUSBCharger) {
      this.microUSBCharger = microUSBCharger;
    }
  
    chargeWithTypeC(): void {
      console.log("Using an adapter to convert Micro-USB to Type-C.");
      this.microUSBCharger.chargeWithMicroUSB();
    }
  }
  
  // Client Code
  const microUSBCharger = new MicroUSBCharger();
  const adapter = new MicroUSBToTypeCAdapter(microUSBCharger);
  
  // Now, we can charge a USB-C device using a Micro-USB charger through the adapter.
  adapter.chargeWithTypeC(); // Output: Using an adapter to convert Micro-USB to Type-C. Charging with Micro-USB charger.
  
import sys, json
try:
    from PIL import Image
except ImportError:
    import Image
import pytesseract
import pyap

def ocr_core(filename):
    """
    This function will handle the core OCR processing of images.
    """
    text = pytesseract.image_to_string(Image.open(filename)) # We'll use Pillow's Image class to open the image and pytesseract to detect the string in the image
    return text

# print(ocr_core('./0011.jpg'))    

def parse_address(addressString):
    addresses = pyap.parse(addressString, country='US')
    return addresses

def main():
    inputJson = json.loads(sys.argv[1]) #sys.argv[0] is filename
    opType = inputJson["type"]
    if opType == "file":
        filename = inputJson["filename"]
        result = ocr_core(filename)
    elif opType == "address":
        address_string = inputJson["addressstring"]
        result = parse_address(address_string)
    else:
        pass    
    
    print(result)

#start process
if __name__ == '__main__':
    main()
    
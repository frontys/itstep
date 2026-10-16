#include <iostream>

using namespace std;

int main() { 
    int a = 0;
    int sum = 0;  

    cout << "Enter number >>> " << endl;
    cin >> a;
    for (int f = a; f < 500; f++)
    {
        sum += f;
    }  
    
    cout << "Sum numbers from " << a << " to 500 is >>> " << sum << endl;
    system("pause");
}
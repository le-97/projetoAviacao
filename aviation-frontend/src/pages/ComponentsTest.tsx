import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ComponentsTest: React.FC = () => {
  const [inputValue, setInputValue] = useState("")
  const [selectValue, setSelectValue] = useState("")

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">shadcn/ui Components Test</h1>
          <p className="text-muted-foreground">Testing all installed components in the Aviation Control System</p>
        </div>

        {/* Button Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Button Component</CardTitle>
            <CardDescription>Testing different button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">🛩️</Button>
            </div>
          </CardContent>
        </Card>

        {/* Input and Select Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
            <CardDescription>Testing Input and Select components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="test-input" className="text-sm font-medium">Flight Number</label>
              <Input
                id="test-input"
                placeholder="Enter flight number (e.g., BA123)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="test-select" className="text-sm font-medium">Aircraft Type</label>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select aircraft type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boeing-737">Boeing 737</SelectItem>
                  <SelectItem value="airbus-a320">Airbus A320</SelectItem>
                  <SelectItem value="boeing-777">Boeing 777</SelectItem>
                  <SelectItem value="airbus-a380">Airbus A380</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Dialog Test */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog Component</CardTitle>
            <CardDescription>Testing modal dialog functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Flight Details Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Flight Information</DialogTitle>
                  <DialogDescription>
                    This is a test dialog for displaying flight information in the aviation control system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="flight-id" className="text-right">Flight ID</label>
                    <Input id="flight-id" value="BA123" className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="departure" className="text-right">Departure</label>
                    <Input id="departure" value="London Heathrow (LHR)" className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="destination" className="text-right">Destination</label>
                    <Input id="destination" value="John F. Kennedy (JFK)" className="col-span-3" readOnly />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Update Flight Status</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Card Component Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Flight BA123</CardTitle>
              <CardDescription>London → New York</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Departure: 14:30 GMT</p>
              <p className="text-sm text-muted-foreground">Arrival: 17:45 EST</p>
              <p className="text-sm text-muted-foreground">Aircraft: Boeing 777</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Track Flight</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flight LH456</CardTitle>
              <CardDescription>Frankfurt → Tokyo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Departure: 11:20 CET</p>
              <p className="text-sm text-muted-foreground">Arrival: 06:30+1 JST</p>
              <p className="text-sm text-muted-foreground">Aircraft: Airbus A380</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Track Flight</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flight AF789</CardTitle>
              <CardDescription>Paris → Sydney</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Departure: 23:15 CET</p>
              <p className="text-sm text-muted-foreground">Arrival: 05:45+2 AEDT</p>
              <p className="text-sm text-muted-foreground">Aircraft: Boeing 787</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Track Flight</Button>
            </CardFooter>
          </Card>
        </div>

        {/* State Display */}
        <Card>
          <CardHeader>
            <CardTitle>Component State</CardTitle>
            <CardDescription>Current values from form components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Input Value:</strong> {inputValue || "empty"}</p>
              <p><strong>Select Value:</strong> {selectValue || "none selected"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ComponentsTest